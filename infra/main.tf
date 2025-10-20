# 🔧 Déclare le provider AWS (nécessaire pour dire à Terraform sur quel cloud travailler)
provider "aws" {
  region = var.region  # La région AWS est définie dans terraform.tfvars
}

# 🌐 Crée un VPC (réseau privé virtuel)
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr  # Plage d’adresses IP pour ton réseau
}

# 🧩 Crée un sous-réseau public dans le VPC
resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id  # Le VPC auquel ce subnet appartient
  cidr_block = var.subnet_cidr  # Plage IP du subnet
}

# 💻 Crée une instance EC2 (machine virtuelle)
resource "aws_instance" "web" {
  ami           = var.ami_id         # ID de l’image AMI (Ubuntu, Amazon Linux, etc.)
  instance_type = var.instance_type  # Type d’instance (ex. : t2.micro)
  subnet_id     = aws_subnet.public.id  # Le subnet dans lequel l’instance sera lancée

  tags = {
    Name = "WebServer"  # Nom de l’instance (utile pour la retrouver dans la console AWS)
  }
}

# 🗄️ Crée une base de données RDS (MySQL)
resource "aws_db_instance" "db" {
  allocated_storage    = 20              # Taille du disque en Go
  engine               = "mysql"         # Type de base de données
  instance_class       = "db.t3.micro"   # Type d’instance RDS
  username             = var.db_user     # Nom d’utilisateur de la BDD
  password             = var.db_pass     # Mot de passe de la BDD
  skip_final_snapshot  = true            # Ne pas créer de snapshot à la suppression
}
