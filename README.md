<p align="center"><img src="./wporgassets/banner-772x250.png" /></p>

<h1 align="center"> Revenue Generator by LaterPay </h1>

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![License](https://img.shields.io/github/license/laterpay/revenue-generator)](https://github.com/laterpay/revenue-generator/blob/master/LICENSE)

##### Revenue Generator is the official Plugin for selling digital content with WordPress which uses [Connector Integration](https://docs.laterpay.net/connector/).
<hr/>

### Table of Contents

- [Installation](#installation)
- [Contributing](#contributing)
- [Development Notes](#development-notes)
- [Usage](#usage)
- [Project Structure](#project-folder--file-structure)
- [Terminology](#terminology)
- [Versioning](#versioning)
- [Copyright](#copyright)

## Installation

The latest release of the plugin is available [here](https://github.com/laterpay/revenue-generator/releases/latest).

## Contributing

1. Fork it [here](https://github.com/laterpay/revenue-generator/fork).
2. Run `composer install` to install all the dependencies, mainly used for linting `PHP` code.
3. Run `npm install` to install all the dependencies, mainly used for building/compiling plugin assets.
4. Create your feature branch (`git checkout -b feature/my_new_feature develop`)
4. Add your changes, verify coding standards and PHP compatibility ( [Check Development Notes](#Development Notes) )
5. Run `npm run build` for `js` and / or `css` changes. Please check [package.json](package.json) for more development scripts.
6. Commit your changes ( eg. `git commit -am 'Add support for feature x'`)
7. Push to the branch (`git push origin feature/my_new_feature`)
8. Create a new Pull Request to `develop`.

## Development Notes

##### Please run following commands from the root directory of this repository.

1. Please verify your code is in compliance to the Coding Standards used in this Project.
2. Run `composer phpcs filename` or `composer phpcs` to check for PHPCS errors/warnings.
3. Run `composer phpcsbf filename` or `composer phpcbf` to automatically fix possible PHPCS errors/warnings.
4. Run `composer phpcompat` to check if the code is compatible for PHP 5.6 and above.
5. Run `npm run build` to build production build assets.
6. Run `npm run dev` to keep the build process running while making changes to assets.
7. Run `npm run lint:js` to to check for JS errors/warning.
8. Run `npm run lint:js:fix` to automatically fix possible errors/warning in JS code.
9. Run `npm run language` to update project po file.
10. Run `npm run zip` to create final zip with production assets.

## Usage

- Install the latest zip or use the latest code from `master` branch in your test site.
- Activate the plugin and select `Revenue Generator` in the menu.
- Go through the Welcome wizard, check the  tutorial to understand the available features.
- Try publishing the paywall, it will ask to connect your account ( only asked once ).
- You should see now see the created paywall on frontend.

## Project Folder / File Structure

```text
revenue-generator
├── assets
|   ├── build             ( Plugin build assets )
│   └── src               ( Plugin source assets )
├── bin
├── inc
│   ├── classes           ( Common classes )
│   │   └── post-types    ( Custom CPT classes )
│   ├── helpers           ( Helper classes )
│   └── traits            ( Traits classes )
├── languages             ( Language files for translation )
├── templates             ( Markup templates used around the plugin )
│   └── backend           ( Markup templates used in admin area )
├── tests                 ( Automated tests )
├── wporgassets           ( WordPress / Github assets )
├── LICENSE               ( Project LICENSE )
├── README.md             ( Project README.md )
├── phpcs.xml             ( Project PHPCS ruleset )
├── phpunit.xml           ( Project PHPUNIT ruleset )
├── uninstall.php         ( Plugin uninstall file )
└── revenue-generator.php ( Plugin main file )
```

## Terminology

#### Payment Options

- **Paywall** - A Paywall comprises of several purchase options including Single Purchases / Time Passes / Subscriptions, which is used to add pricing to your sites content.
<hr/>

- **Single Purchase** - A Single Purchase grants a customer infinite access to a single piece of content and can be sold as “Buy Now, Pay Later” and “Buy Now”.
<hr/>

- **Subscription** - A Subscription grants a customer access for a limited period of time, but it will automatically renew afterwards and the user will be charged again. Therefore, Subscriptions are only available as “Buy Now”.
<hr/>

- **Time Pass** - A Time Pass grants a customer access to a resource for a set amount of time, they do not auto-renew after the set time period for the purchase runs out. Time Passes can also be sold as “Buy Now, Pay Later” and “Buy Now”.

#### Payment Models

- **Pay Later** - When a customer purchases “Pay Later” content, the item is added to their open invoice and they will be asked to pay once they hit the threshold of 5€ or $5. Pay Later items can be offered between 0.05€ and 5.00€ and between $0.05 and $5.00.
<hr/>

- **Pay Now** - The “Pay Now” payment model will require a customer to pay directly. The item will not be added to any open invoice. Pay Now items can be offered between 1.00€ and 1000.00€ and between $1.99 and $1000.00.
                                                                                                                                    

## Versioning

The Revenue Generator plugin uses [Semantic Versioning 2.0.0](http://semver.org)

## Copyright

Copyright 2020 LaterPay GmbH – Released under MIT [LICENSE](LICENSE).
