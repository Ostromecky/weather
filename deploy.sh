#!/bin/bash

# Build the Angular app
ng build --configuration=production

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Angular build successful"

    # Execute ng deploy
    ng deploy
else
    echo "Angular build failed"
fi
