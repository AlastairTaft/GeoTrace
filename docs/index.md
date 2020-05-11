# What is Geo Trace?
Geo Trace is a GPS based contact tracing app that emphasises privacy. It uniquely encrypts location data points in a way that can be compared without being decrypted. 

# Why?
One of the most useful tools we have in limiting the spread of the virus is contact tracing. If we can quickly inform those who are at risk of unknowingly contracting the virus, those individuals can take precautions to prevent passing it on to others. Speed is an advantage. It also means that once lockdown is eased people can selectively isolate to prevent further outbreaks without bringing the economy to a halt.

## 1. Introduction
This is a proposal to solve contact tracing in a privacy first way. Contact tracing is the process of reaching out to all the people who have been in contact with a person who has newly been diagnosed with the virus so that those people can self isolate and prevent spreading the virus further. Typically this is done by health authorities asking the person where they have been, which is slow and doesn't catch everyone at risk. Many solutions have or are being developed to solve this problem and some raise questions about privacy. Governments want to open back up and get their economy going again. Effective contact tracing is a useful tool to do this without risking further out breaks, which is why it's not surprising we're seeing some governments make their contact tracing app mandatory, i.e. mandatory tracking of their citizens. This raises ethical concerns. We have seen in the past that changes of law and technology during times of crisis often stick around permanently. Hence the focus on this solution to be effective but have a strong focus on privacy.

### 1.1 Privacy & Utility Goals
Our system has some guiding principles.

- Unguessable one way data encryption
- A central database

#### 1.1.1 Unguessable one way data encryption
All location and timestamp data is hashed. This is one way encryption that removes the original information from the data yet a hash can still be compared against other user's hashes to find matches to determine risk. That's all well and good but without any additional measures that data can be very easily reverse engineered. In the same way a malicious user can target location and timestamp points to generate hashes and look for collisions to figure out the original data.

We solve this by throwing in short lived salts that can only be obtained en-mass by a very large network (i.e. millions of unique devices with their own IPs), this is very difficult for a malicious user to emulate and thus not practical to search for hash collisions. Our salts are only active for a short window of time which means any possible attack must be done in this same window of time. This will prevent malicious actors from reverse engineering the data at some point in the future.

#### 1.1.2 A Central Database
We store the hashed data from both infected and non infected users. This gives us maximum utility, it is quick to determine if someone is at risk and we can calculate the infection chain across multiple levels of contacts. With this method a wide net can be cast to halt a second out break.

## 2. Our solution
The problem with hashes is that they are predictable given enough computing power. Typically in the software world to combat this a salt is added before creating the hash, a salt is only known to the specific user, this makes brute forcing to guess the hash a magnitude more difficult. But the challenge in this scenario is that all mobile users would need to agree on the same salt in order to produce the same hash for comparing who's at risk. How do you do that without a malicious user knowing the salt too? 

We propose having ‘salt servers’, these are independent from the central server and their only job is to send the same salt back to all mobile users that request one. The mobile device then uses this salt to hash their location data before sending it to the central server. The idea is for independent servers that have no affiliation with the central server to be these salt servers. If the same entity controls all servers then it is possible to brute force and reverse engineer the data, but these salt servers never get the complete picture of the data and they help encrypt the data so the central server can never reverse engineer it. Private companies or individuals can hold the salt servers and the Government can hold the central server.

A malicious user could still try and obtain these salts in order to brute force reverse engineering location data however there are a few things we do to make it sufficiently too expensive to reliably be able to. 

## 3. In detail
The user installs our app. In the background it tracks their location every 5 minutes and stores these data points on the device. Periodically (hourly) the phone will sync with a central server.

### 3.1 Location bit algorithm
Each location position is roughly accurate to 10 meters. If we receive a location position that is not accurate to at least 10 meters then we discard it.

We scramble this data to remove the user’s home location and any location points that are near to here, we can figure this out by it being where the user spends time at night. This better anonymises users as a last line of defence if the data can ever be reverse engineered.

We then split the world into three layers split by hexagonal blocks, each one shifted to compensate if location points are at the edge of any block, so we have a block layer A, B and C. Each block is then given a predefined reference value. We also divide the area over a single hexagonal grid that’s split by 50 kilometer blocks, layer D (used to get the salt, more on that later).

Layer A, B and C looks like this. ![example](https://i.imgur.com/wC0rKkT.png)
Red dots indicate real location positions. They are sifted into their matching hexagonal block for each layer.

We also split the current time into different block intervals. We store the block of the current time and the next block so we can track at risk areas over time. We store blocks at interval sizes of 5, 10, 20, 40 and 80 minutes.

![time block example](https://i.imgur.com/k5XAlQ3.png)

So each location point is now represented with the following data points.

- Hexagon Layer A n
- Hexagon Layer B n
- Hexagon Layer C n
- Timestamp Block 5 min
- Timestamp Block 5 min next
- Timestamp Block 10 min
- Timestamp Block 10 min next
- Timestamp Block 20 min
- Timestamp Block 20 min next
- Timestamp Block 40 min
- Timestamp Block 40 min next
- Timestamp Block 80 min
- Timestamp Block 80 min next

With the above each hexagon layer + a timestamp block is what makes a risk hash. Therefore we have 30 risk points to hash.

For each risk point we send the following.

| Field     | Type | Description |
| --------- | ---- | ----------- |
| Risk hash | String | The hashed risk point. |
| User ID   | String | The current user id, only known by this user, not publically shared. |
| Timestamp block size | Integer | The size of the timestamp block in minutes. Will be used as part of the risk algorithm to know how at risk a person is when entering an area that was previously occupied by an infected person. |


### 3.2 Encryption algorithm
To hash we do the following. Take the total number of salt servers we have and do the following

```
Salt server index = Location Layer D N modulus (%) Total Salt Servers.
```

Take the respective salt server and map it to all the risk points. Aggregate all these points by salt server, likely will have 1 to 3 salt servers, but sometimes more if the user has travelled large distances, but most commonly 1.

Send the timestamp block n value of each location point in bulk to each salt server. To get back a list of salts to use.

Now we hash the earlier risk points using the salt.

### 3.3 Salt server
After receiving a request from a user with a certain IP, that IP must be rate limited to not be allowed to make another request for another hour. This will mean the salts for all timestamps can’t be brute forced unless you have a multitude of IPs, servers can impose further restrictions on whitelisting only expected IPs to prevent being attacked across regions. And a maximum of 90 salts can be requested at any one time. This allows a device to sync at a minimum every 3 hours.

If more salts are requested the server will error. 

If an IP has already made a request in the last three hours, an error is thrown (NOTE: If devices may commonly share an IP an alternative rate limiting solution will need to be found). 

This makes it very difficult to brute force all possible salts.

If the timestamp is more than 3 hours in the past, throw an error (account for the risk points being different minute windows apart). If timestamps are too far in the future, throw an error. This means that there will be a very small window in time where salts can be brute forced, after that window has passed the salts are lost in time.

### 3.4 Central server risk algorithm
If a user marks they are COVID-19 positive. The server can mark all user hashes that match the COVID-19 positive user’s hashes as ‘at risk’. It can also then mark all users that intersect hashes with that person as ‘at risk’, this level of how many connections to mark can be tweaked as more information comes in from what is optimal and won’t cause unnecessary panic.

After a period of time has elapsed where a person can remain symptomless or on average undiagnosed while being a carrier all data for that user will be deleted.

Now each exact data point can be hashed with the returned salts and sent to the central server and the central server will respond with any location points that have been marked as ‘at risk’ for this user. 

When a user reports their location points, if they are COVID-19 positive, run the respective risk algorithms. If they do not return any historic data points that have been marked as 'at risk'.
