# Why?
One of the most useful tools we have in limiting the spread of the virus is contact tracing. If we can quickly inform those who are at risk of unknowingly contracting the virus, those individuals can take precautions to prevent passing it on to others. Speed is an advantage. It also means that once we ease out of lockdown we can selectively isolate to prevent further outbreaks without bringing the economy to a halt.

## 1. Introduction
This is a proposal to solve contact tracing in a privacy first way. Contact tracing is the process of contacting all the people who have been in contact with someone who has newly been diagnosed with the virus so that those people can self isolate and prevent spreading the virus further. Typically this is done by health authorities asking the person where they have been, which is slow and doesn't catch everyone at risk. Many solutions have or are being developed to solve this problem and some raise questions about privacy. Governments want to open back up and get their economy going again. Effective contact tracing is a useful tool to do this without risking further out breaks, which is why it's not surprising we're seeing some governments make their contact tracing app mandatory, i.e. mandatory tracking of their citizens. This raises serious ethical concerns. We have seen in the past that changes of law and technology during times of crisis often stick around permanently. Now more than ever it's important to build tools that solve the problem of the crisis but can not be abused for other purposes.

### 1.1 Privacy & Utility Goals
Our system has some guiding principles.

- Unguessable one way data encryption
- A central database

#### 1.1.1 Unguessable one way data encryption
All location and timestamp data is hashed. This is one way encryption that removes the original information from the data yet a hash can still be compared against other user's hashes to find matches to determine risk. That's all well and good but without any additional measures that data can be very easily reverse engineered. In the same way a malicious user can target location and timestamp points to generate hashes and look for collisions to figure out the original data.

We solve this by throwing in short lived salts that can only be obtained en-mass by a very large network (i.e. millions of unique devices with their own IPs), this is very difficult for a malicious user to emulate and thus not practical to search for hash collisions. Our salts are only active for a short window of time which means any possible attack must be done in this same window of time. This will prevent malicious actors from reverse engineering the data at some point in the future.

#### 1.1.2 A Central Database
We store the hashed data from both infected and non infected users. This gives us maximum utility, it is quick to determine if someone is at risk and we can calculate the infection chain across multiple levels of contacts. Something which can't be done if only data from infected users is shared.

### 1.1 Bluetooth 
Solutions such as Singapore’s Trace Together app, COVID Watch and CoEpi record when users come in close proximity to each other. Once diagnosed with the virus contact data is then shared with an authority this data is then shared with all users who can then see if they've come in contact with the virus using data stored locally on their device. While this is a promising option it has one drawback, it can’t keep track of an at risk area. I.e. if an infected person visits a location, touches surfaces and leaves, then five minutes later another person may visit the same location and touches the same surface, that person is then at risk but was not picked up by Bluetooth ping. A further drawback is tracking the infection chain can be slow. If an 'at risk' person self identified by the user's app goes on to develop symptoms, it's not until that person is officially diagnosed do the second tier of people this person has been in contact with end up being notified, this might not be quick enough to stop the spread, given that it can take on average 5 to 6 days to develop symptoms.

### 1.2 Hybrid GPS data
Apps like MIT’s Safe Paths track your location positions locally. Periodically they pull down location data from infected users from a remote server. The app then computes locally if the user has crossed paths with any infected users. The claim is that this is privacy focused because non infected users data is never shared. While that is true, infected user's data is available for anyone to see, putting them at risk of persecution. Also there’s a huge performance cost to downloading a large data set of all infected cases and computing it locally. In contact tracing and exponential growth of the virus, speed is a critical factor, if you can only provide warnings once every 12 hours or more it defeats the point somewhat. Also if you are only tracking those that are diagnosed, then at most you are only going to know to warn tier 1 contacts, which is the same problem the Bluetooth solution has, it may be too slow to track down and warn those tier 2 contacts.

### 1.3 All GPS data
This solution would be sending all users' gps data to a central server, the server then processes all this data to inform those who are at risk. This is the optimal solution for utility, because if person A is diagnosed, all the data is available to know who person A has been in contact with and all the contacts of those contacts, immediately. Which means you can warn everyone who is on the infection chain to any desired degree, this may be exactly what’s needed to stop a new wave. However this solution is unacceptable to protect people’s privacy, giving a central authority access to all users location history could open those users up to abuse and misuse of their personal data.

### 1.4 Encrypted GPS data
MIT has an excellent paper on this idea, titled “Assessing Disease Exposure Risk with Location Data: A Proposal for Cryptographic Preservation of Privacy”. This is option 1.2 + encryption. The idea is to divide all user’s location history into finite blocks. Then hash each block. Because a block is hashed you cannot figure out the person’s original location unless you brute force all the possible location positions to then match to the hash. That said with this solution it would be naive to believe a malicious actor, especially a government wouldn’t have the resources to do exactly this. And furthermore it would be relatively cheap to target specific locations to hash to target minority groups. For example computing all the hashes of location points around mosques and churches if you wanted to target religious groups.

## 2. Our solution
Given the central server solution has the most utility in order to fight an outbreak we aim to go that route but in a way that does not compromise on privacy. We will hash in a way that is much more difficult to brute force and reverse engineer.

The problem with hashes is that they are predictable given enough computing power. Typically in the software world to combat this a salt is added before creating the hash, a salt is only known to the specific user, this makes brute forcing to guess the hash a magnitude more difficult. But the challenge in this scenario is that all mobile users would need to agree on the same salt in order to produce the same hash for comparing who's at risk. How do you do that without a malicious user knowing the salt too? 

We propose having ‘salt servers’, these are independent from the central server and their only job is to send the same salt back to all mobile users that request one. The mobile device then uses this salt to hash their location data before sending it to the central server. The idea is for independent servers that have no affiliation with the central server to be these salt servers. If the same entity controls all servers then it is possible to brute force and reverse engineer the data, but these salt servers never get the complete picture of the data and they help encrypt the data so the central server can never reverse engineer it. Private companies or individuals can hold the salt servers and the Government can hold the central server.

A malicious user could still try and obtain these salts in order to brute force reverse engineering location data however there are a few things we do to make it sufficiently too expensive to reliably be able to. 

## 3. In detail
The user installs our app. In the background it tracks their location every 5 minutes.

### 3.1 Location bit algorithm
Each location position is roughly accurate to 10 meters. If we receive a location position that is not accurate to at least 10 meters then we discard it.

We scramble this data to remove the user’s home location and any location points that are near to here, we can figure this out by it being where the user spends time at night (may need to store points in local storage to be able to figure this out). This better anonymises users as a last line of defence if the data can ever be reverse engineered.

We then split the world into three predefined roughly 10 metre squared blocks, each one shifted to compensate if location points are at the edge of any block, so we have a block layer A, B and C. Each block is then given a predefined reference value. We also divide the area over a single hexagonal grid that’s split by 20 kilometer squared blocks, layer D (used to get the salt, more on that later).

Layer A, B and C looks like this. ![example square grids](https://i.imgur.com/7r6WFnL.png)
Red dots indicate real location positions. They are sifted into their matching hexagonal block for each layer.

Note: Hexagon grids would likely be better [!example](https://i.imgur.com/wC0rKkT.png) however it turns out splitting a sphere into hexagon areas is quite a complex problem to solve, perhaps can be done in the future.

We also split each timestamp into 5 minute blocks. And for the same reason as using multiple layers to match when a user is near to an infected user in the adjacent block, we split the timestamps into a second timestamp block that’s shifted by 2.5 minutes and given a number 1 to n.

We do this again for timestamp blocks split by 15 minutes, then 40 minutes, then 110 mins then 300 minutes then 815, then 2215 mins. But for this layer we mark the block that is the next adjacent one to the one we are currently in. And we also split each block by 2 shifted equally apart.

So each location point is now represented with the following data points.

- Hexagon Layer A n
- Hexagon Layer B n
- Hexagon Layer C n
- Timestamp Block A n
- Timestamp Block B n
- Timestamp Block C n
- Timestamp Block D n
- Timestamp Block E n
- Timestamp Block F n
- Timestamp Block G n
- Timestamp Block H n
- Timestamp Block I n
- Timestamp Block J n
- Timestamp Block K n
- Timestamp Block L n
- Timestamp Block M n
- Timestamp Block N n

With the above each hexagon layer + a timestamp block is what makes a risk hash. Therefore we have 42 risk points to hash.

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
After receiving a request from a user with a certain IP, that IP must be rate limited to not be allowed to make another request for another hour - 10 minutes (as a buffer). This will mean the salts for all timestamps can’t be brute forced unless you have a multitude of IPs, servers can impose further restrictions on whitelisting only expected IPs to prevent being attacked across regions. And a maximum of 12 * 42 salts can be requested because we only track the location position every 5 minutes and send them every hour. Each 5 minute interval will compute 42 risk points.

If more salts are requested the server will error and still rate limit that user. 

If an IP has already made a request in the last hour, an error is thrown (NOTE: If devices may commonly share an IP an alternative rate limiting solution will need to be found). 

This makes it very difficult to brute force all possible salts.

If the timestamp is more than 1 hour 10 in the past, throw an error (account for the risk points being different minute windows apart). If timestamps are too far in the future, throw an error. This means that there will be a very small window in time where salts can be brute forced, after that window has passed the salts are lost in time.

### 3.4 Central server risk algorithm
If a user marks they are COVID-19 positive. The server can mark all user hashes that match the COVID-19 positive user’s hashes as ‘at risk’. It can also then mark all users that intersect hashes with that person as ‘at risk’, this level of how many connections to mark can be tweaked as more information comes in from what is optimal and won’t cause unnecessary panic.

After a period of time has elapsed where a person can remain symptomless or on average undiagnosed while being a carrier all data for that user will be deleted.

Now each exact data point can be hashed with the returned salts and sent to the central server and the central server will respond with any location points that have been marked as ‘at risk’ for this user. 

When a user reports their location points, if they are COVID-19 positive, run the respective risk algorithms. If they do not return any historic data points that have been marked as 'at risk'.
