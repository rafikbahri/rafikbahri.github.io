output "pages_url" {
  value       = "https://${cloudflare_pages_project.blog.subdomain}"
  description = "Cloudflare Pages URL"
}

output "custom_domain" {
  value       = "https://${var.domain_name}"
  description = "Custom domain URL"
}