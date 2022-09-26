# Launching a Headless Craft Commerce Site Workshop

## Get a copy of the project

The project is hosted in a public GitHub repository at https://github.com/FosterCommerce/headless-craft-commerce.git

Later on we will be deploying the site to The Cloud using Vercel. In order to do this, you will need to host the code in your own repository using GitHub, GitLab, or Bitbucket. For simplicity, these instructions are assuming you are using GitHub. 

### Importing with GitHub
If you have a GitHub account you can simply import the project into a new repo.

1. Log in to your GitHub account and go to your Repositories tab.
2. Click "New", give the repository a name, and click "Create"
3. On the next screen click the "Import Code" button and enter the url https://github.com/FosterCommerce/headless-craft-commerce.git. It may take a few minutes to import the code.
4. Once that is done, you can check the repository out to your local machine as normal.

If you do it this way, then skip to the Installation section below.

### Cloning the repository and changing remote
Alternatively you can clone the project to your local machine and change its remote origin to your own repository.

1. **Clone the project** to your local machine with
- `git clone git@github.com:FosterCommerce/headless-craft-commerce.git`
- or; `git clone https://github.com/FosterCommerce/headless-craft-commerce.git`
- or; download the project as a .zip file from [https://github.com/FosterCommerce/dot-all-2022/archive/refs/heads/develop.zip](https://github.com/FosterCommerce/headless-craft-commerce/archive/refs/heads/main.zip)

2. **Change the origin**
To make this your own, fire up a terminal and navigate to the root directory of the project. Type the following; 
`git remote set-url <url of your repo>`

3. You'll then need to push the code up to your own repository

---
## Installing the dev environment

### Docker and Docker Desktop

You will need Docker Desktop and DDEV in order to run this project.

Docker is free for small businesses (fewer than 250 employees AND less than $10 million in annual revenue), personal use, education, and non-commercial open source projects.

Take a look at [this blog post](https://blog.fortrabbit.com/local-craft-dev-site-ddev-development-tool) from Fortrabbit for a quick guide for installing Docker and DDEV. You only need follow the part titled "Install DDEV to power your local Craft CMS dev sites".

### Installation with DDEV

This workshop repo includes DDEV config files so if you have Docker Desktop and DDEV installed on your machine, you can get the project up and running quickly by doing the following:

1. Save the .env.example file as .env, and add values for CRAFT_APP_ID and CRAFT_SECURITY_KEY :

        // Craft App Settings
        CRAFT_APP_ID=
        CRAFT_SECURITY_KEY=
        
   The APP_ID and CRAFT_SECURITY_KEY can be any random strings. Use something like https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx or just mash that keyboard.

2. Open your terminal and go to the projects root directory :

        cd <path-to-project>/dot-all-2022

3. Start up Docker Desktop and after it loads, start DDEV in your terminal :

        ddev start
        
   If you have problems starting ddev because ports are in use then make sure you shut down other servers that may be using the same ports (such as Nitro) and try starting ddev again.

4. Once DDEV has finished downloading and configuring its Docker containers and starts to run, install the project's composer dependencies :

        ddev composer install
            
5. Import the projects seed database into DDEV :

        ddev import-db --src=project_db.sql.gz
        
   Alternatively if you are on a Mac and have TablePlus, SequelPro or SequelAce installed, you can open these
   apps directly from DDEV and import the same database SQL dump seed file (project_db.sql.tar.gz):
   
        // Using TablePlus
        ddev tableplus
        
        // Using SequelPro
        ddev sequelpro
        
        // Using SequelAce
        ddev sequelace
        
6. Get Craft up and running and apply any changes to the config:

        ddev exec php craft up
        
*Note You should run the above command whenever you pull down an update from the repository in order to apply any config changes that have been made since you last pulled down the repo.*
    
7. Next we need to install Nuxt and the other dependencies for the front end build. In your terminal
run the following command :

        ddev yarn install

*Note This process can take a few minutes to download and install the necessary packages.
        
1. To run the front end of the project in dev mode, you then use the following command :

        ddev yarn dev

2.  In your browser you can now access the site running locally in DDEV :
    
    * **Craft Admin**

            https://dot-all-2022.fostercommerce.test/admin
        
        * Username : admin
        * Password : password
        
    * **Front End** (on port 3000)
    
            https://dot-all-2022.fostercommerce.test:3000


---


# Deploying the site to Vercel

## What is Vercel?
According to a quick Google search&hellip;

>"Vercel is a cloud platform that enables developers to host websites and web services that deploy instantly, scale automatically, and require no supervision"

Basically, it's a quick and easy way to get a site up and running in the cloud for showing to your friends, family, and clients.

We are going to use Vercel to get your new Headless Commerce site online. The Front-end of the site will be hosted on your own Vercel account and the Back-end, Craft installation, and database, will be on Foster Commerce's Forge server. Everyone will share the same Back-end.

### Create a Vercel account

_If you already have a Vercel account then you can skip this part._

Vercel offers a free "Hobby" tier which will be great for what we are doing.

First off, head over to https://vercel.com/signup

Vercel will be pulling code from your repository. It works with GitHub, GitLab, and Bitbucket. So sign in using one of those options or alternatively, sign up using an email address. We recommend using GitHub.

For our purposes, we are going to assume you have logged in using GitHub. If you haven't then please head into your Vercel settings and add GitHub as a Repository provider.

1. You should now see a list of your repositories and you can select the project to import into Vercel. Choose your DotAll repo and click "Import".

2. Give your Vercel project a name (or just keep the default)

3. The Framework Preset should be Nuxt.js

4. Root directory should be ./

5. Open the Build and Output Settings

6. Set the Build Command to `yarn run build`

7. Set the Output Directory to `.nuxt`

8. Open the Environment Variables tab and set the following
   
| Variable name | Value |
| --- | --- |
| CRAFT_BASE_URL | https://dot-all-2022.fosterstaging.com |
| CRAFT_ENVIRONMENT | staging (or production is fine too) |
| ASSET_BASE_URL | https://dot-all-2022.fosterstaging.com/assets |
| STRIPE_PUB_KEY |  pk_test_51LlDeCIQuBaBLwXUlhgSLcxeO57AtPojwBAKcK32OiXmNLkJ75zbFfAqQRBOzcryuHXt8CPhXWcsca6tha7JpM5Z00FEZRVfNm |
| PAYPAL_CLIENT_ID |AXP96ibcJy88Xp0cthYMmO8_B0Mzln8TMy7D1LiuUMbXQG89ghRTJQLvbY8oS4AiQuNn2qbnKvn3yFy0 |

9. Then click "Deploy"

From this point on, Vercel will create a deployment whenever you push changes to your repo. The deployments are based on the branch you push to so you can have separate "sites" for your development, preview, and production. By default, the production site will deploy from `main` or `master`.

# Testing the site

Access the Front-end of the site with your own Vercel App url

If you have used the example .env file then you will already be hooked up to our test Stripe and Paypal accounts. Feel free to change the keys to use your own test accounts.
## Checking out with Stripe
We have hooked the site up to a Stripe Test account.
Use the following card details to check out. 
- Stripe test card: 4242424242424242
- Expiry: any future date
- CVV: 123

## Checking out with Paypal
We have hooked the site up to our Paypal Sandbox account so to checkout using Paypal you will need to use the following credentials
- Email: sb-rqy43z21028865@personal.example.com
- Password: fcdotall

- Paypal test card number: 4111111111111111
- Expiry: any future date
- CVV: 123

## Discount codes
There is a test discount code already set up. 

Use code **GIVEME10** for a sweet 10% off an imaginary product in the imaginary store! Thank us later.

