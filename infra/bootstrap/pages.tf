resource "cloudflare_pages_project" "blog" {
  account_id        = var.cloudflare_account_id
  name              = "rafikbahri-com"
  production_branch = "master"

  deployment_configs = {
    production = {
      environment_variables = {
        NODE_VERSION = "25"
      }
      fail_open = false
    }
    
    preview = {
      environment_variables = {
        NODE_VERSION = "25"
      }
      fail_open = false
    }
  }
}

resource "cloudflare_pages_domain" "blog_domain" {
  name         = var.domain_name
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.blog.name
}

resource "cloudflare_pages_domain" "blog_www" {
  name         = "www.${var.domain_name}"
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.blog.name
}