# 🔧 Provider AWS
provider "aws" {
  region = var.region
}

# 💻 EC2 Instance (dans le VPC par défaut)
resource "aws_instance" "web" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  iam_instance_profile   = "LabInstanceProfile"  # ← Respecte les restrictions IAM

  tags = {
    Name = "SandboxEC2"
  }
}

# 🗄️ DynamoDB Table
resource "aws_dynamodb_table" "users" {
  name           = "UsersTable"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  tags = {
    Environment = "Sandbox"
  }
}
