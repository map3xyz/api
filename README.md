# Map3 Trustless Crypto Assets API

This repository contains a sampple API server that can be self hosted and provides convenient access to the
<a href="https://map3.xyz">Map3 Trustless Crypto Assets</a> database.

## Installation

### Step 1: Clone the Map3 API respository

<code>git clone git@github.com:map3xyz/api</code>

### Step 2: Install dependencies

<code>yarn install</code>

### Step 3: Setup local environment configuration

A sample environment configuration is provided in the .env.sample file in the root of the repository.

There are 3 variables that can be configured, their usage is as follows:

<code>
ASSETDB_DIR - <span style="color:green">The folder in which the cached database will be downloaded and read</span><br/>
SERVER_PORT - <span style="color:green">The port on which API server will listen for requests</span><br/>
JWT_SECRET  - <span style="color:green">(Optional) if you wish to secure your API, define a JWT secret that is used to verify any JWT authorised requests token</span>
</code>

### Step 4: Run the server

We recommend that you start the server wrapped by 'forever' to ensure it is restarted automatically if the server nodejs process crashes. This will ensure maximum availability.

<code>
forever start -c "yarn start" -l api.log --append ./ &
</code>

