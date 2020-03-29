#!/bin/bash

# Exit if any command fails
set -e

# Include useful functions
. "$(dirname "$0")/includes.sh"

# Change to the expected directory
cd "$(dirname "$0")/../.."

# Check whether Node and NVM are installed
#. "$(dirname "$0")/install-node-nvm.sh"

# Check whether Composer installed
. "$(dirname "$0")/install-composer.sh"

# Check whether Docker is installed and running
. "$(dirname "$0")/launch-containers.sh"

# Set up WordPress Development site.
# Note: we don't bother installing the test site right now, because that's
# done on every time `npm run test-e2e` is run.
. "$(dirname "$0")/install-wordpress.sh"

! read -d '' RevenueGenerator <<"EOT"
MMMMMMMMMMMMWNNMMMMMNK0NMMMMMMMMMMMMWX00XMMMWX000000000KNMN000000000KWMWX000000KNMMMMN000000KNWMMMMMMN00KWMMMX00XMMMMMMN00XWNXNMMM
M0l:::::::::;',o0WMMO,.xWMMMMMMMMMMWO,..:KMMNo,,,...',,c0Wx..',,,;,,cKMNl..',,'',dXMWx...,,,''c0WMMMXl..'xWMMKc.;OWMMM0:.:0XdlkWMM
MX: .;ooooool::dKWMMk..dWMMMMMMMMMMK;....lNMMNXXK: .kXXXWWx..oXXXXXXNWMNc 'kXX0l..lNMd. lKXKk, ,0MMWd..'.,0MMMKc.'kWWO,.:0MWXKNMMM
MM0;.:KMMMMMXxckWMMMk..dWMMMMMMMMMNl.'kx..xWMMMMNc '0MMMMWx..dNNNNNNWMMNc ,0MMM0, :XMd. oWMMNo .kMWk'.oO;.:XMMMXl..od'.cXMMMMMMMMM
MMWO,.lNMMMMx..kMMMMk..dWMMMMMMMMWx..dWNl.'OMMMMNl '0MMMMWx. .,,,,,;xWMNc .lxxo,..xWWd. ;dxdc..cKMK; :KWk..oNMMMNd.  .oNMMMMMMMMMM
MMMWk..ckOOk:.;KMMMMk..dWMMMMMMMMO' .ldd:. :KMMMNl '0MMMMWx..:xxxxxkKWMNc  '.  'o0WMWd. .,;;:lkNMNl  ;ddl' .kWMMMNo  lNMMMMMMMMMMM
MMMMNd'',,,,''dNMMMMk..dWMMMMMMMK: .;::::,..lNMMNl 'OMMMMWx..xMMMMMMMMMNc 'OKc..dNMMWd..xNWWWMMMWd. '::::;. ,0MMMWd. oWMMMMMMMMMMM
MMMMKc;xXXXX0l;kWMMMk. ,looooxXNl..dNWWWWXl..xWMNl '0MMMMWx..;oooooodKMNc '0MNx'.cKWWd..xMMMMMMWO' :KWWWWWk. cXMMMd. oWMMMMMMMMMMM
MMMMXdoKMMMMNkoOWMMMKoccclllcdXXdcxNMMMMMMKdlkNMWOldXMMMMM0occllllcco0MWkldXMMW0olOWM0loKMMMMMMWOlo0MMMMMMNkloKMMM0ol0WMMMMMMMMMMM
EOT

CURRENT_URL=$(wp option get siteurl | tr -d '\r')

echo -e "\nWelcome to...\n"
echo -e "\033[90m$RevenueGenerator\033[0m"

# Give the user more context to what they should do next: Build the plugin and start testing!
echo -e "\nRun $(action_format "npm run dev") to build the latest version of the Revenue Generator plugin,"
echo -e "then open $(action_format "$CURRENT_URL") to get started!"

echo -e "\n\nAccess the above install using the following credentials:"
echo -e "Default username: $(action_format "admin"), password: $(action_format "password")"
