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


# ==========================================
# NUEVO: BASE DE DATOS (Azure Cosmos DB)
# ==========================================
resource "azurerm_cosmosdb_account" "database" {
  name                = "tony-cosmosdb-10037" # ¡CAMBIA LOS NÚMEROS! 
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  free_tier_enabled = true # ¡Usamos la capa gratuita para no gastar créditos!

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "sqldb" {
  name                = "MiAppDB"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.database.name
}

resource "azurerm_cosmosdb_sql_container" "items" {
  name                = "Registros"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.database.name
  database_name       = azurerm_cosmosdb_sql_database.sqldb.name
  partition_key_path  = "/id"
}

# ==========================================
# NUEVO: MICROSERVICIOS (Azure Functions)
# ==========================================
resource "azurerm_storage_account" "storage" {
  name                     = "tonystorage12345" # ¡CAMBIA LOS NÚMEROS! (Solo letras minúsculas y números, nada de guiones)
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "plan" {
  name                = "tony-functions-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "Y1" # Plan de consumo dinámico (Gratis/Barato)
}

resource "azurerm_linux_function_app" "api" {
  name                       = "tony-api-12345" # ¡CAMBIA LOS NÚMEROS!
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = azurerm_resource_group.rg.location
  service_plan_id            = azurerm_service_plan.plan.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key

  site_config {
    application_stack {
      node_version = "20" # Usaremos Node.js para el backend
    }
  }

 
  app_settings = {
    "COSMOS_DB_ENDPOINT" = azurerm_cosmosdb_account.database.endpoint
    "COSMOS_DB_KEY"      = azurerm_cosmosdb_account.database.primary_key
  }
}