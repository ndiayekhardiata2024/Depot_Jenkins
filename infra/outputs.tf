output "instance_id" {
  value = aws_instance.web.id
}

output "db_endpoint" {
  value = aws_db_instance.db.endpoint
}
