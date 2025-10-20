output "ec2_instance_id" {
  value = aws_instance.web.id
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.users.name
}
