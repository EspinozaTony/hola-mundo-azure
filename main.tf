terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# 1. Cambiamos la región a "centralus" (Centro de EE.UU.)
resource "azurerm_resource_group" "rg" {
  name     = "rg-hola-mundo-react"
  location = "centralus" 
}

# 2. La Web App
resource "azurerm_static_web_app" "web" {
  name                = "app-react-ty2ck-prueba"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_tier            = "Free"
  sku_size            = "Free"
}

# 3. Token
output "deployment_token" {
  value     = azurerm_static_web_app.web.api_key
  sensitive = true
}