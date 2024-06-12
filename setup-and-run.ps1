# Define the required directories and their Dockerfile.dev content
$services = @{
    "nginx" = @"
FROM nginx:latest
COPY ./default.conf /etc/nginx/conf.d/default.conf
"@
    "server" = @"
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [""npm"", ""run"", ""dev""]
"@
    "worker" = @"
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [""npm"", ""run"", ""dev""]
"@
    "client" = @"
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [""npm"", ""start""]
"@
}

# Loop through each service and create Dockerfile.dev if it doesn't exist
foreach ($service in $services.Keys) {
    $path = "C:\Users\alabi\OneDrive\Documents\fbcalc\$service\Dockerfile.dev"
    if (-not (Test-Path $path)) {
        Write-Output "Creating Dockerfile.dev for $service"
        $services[$service] | Out-File -FilePath $path -Encoding utf8
    } else {
        Write-Output "Dockerfile.dev for $service already exists"
    }
}

# Debug information
foreach ($service in $services.Keys) {
    $path = "C:\Users\alabi\OneDrive\Documents\fbcalc\$service\Dockerfile.dev"
    if (Test-Path $path) {
        Write-Output "Dockerfile.dev for $service successfully created."
    } else {
        Write-Output "Failed to create Dockerfile.dev for $service."
    }
}

# Navigate to the project root directory
Set-Location -Path "C:\Users\alabi\OneDrive\Documents\fbcalc"

# Run docker-compose up with --build flag
docker-compose up --build
