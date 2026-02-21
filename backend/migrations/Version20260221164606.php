<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260221164606 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE proyecto (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(255) NOT NULL, descripcion LONGTEXT NOT NULL, fecha_inicio DATETIME NOT NULL, fecha_fin DATETIME NOT NULL, estado TINYINT NOT NULL, deleted_at DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, INDEX IDX_6FD202B9B03A8386 (created_by_id), INDEX IDX_6FD202B9896DBBDE (updated_by_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE tarea (id INT AUTO_INCREMENT NOT NULL, titulo VARCHAR(255) NOT NULL, descripcion LONGTEXT NOT NULL, horas_trabajadas INT NOT NULL, proyecto_id INT NOT NULL, usuario_id INT NOT NULL, estado_id INT NOT NULL, INDEX IDX_3CA05366F625D1BA (proyecto_id), INDEX IDX_3CA05366DB38439E (usuario_id), INDEX IDX_3CA053669F5A440B (estado_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE tarea_estado (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(255) NOT NULL, descripcion LONGTEXT NOT NULL, orden INT NOT NULL, color VARCHAR(255) NOT NULL, activo TINYINT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE tarifa (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(255) NOT NULL, descripcion LONGTEXT NOT NULL, valor_por_hora NUMERIC(2, 0) NOT NULL, moneda VARCHAR(255) NOT NULL, activa TINYINT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE usuario (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, nombre VARCHAR(255) NOT NULL, estado TINYINT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, deleted_at DATETIME DEFAULT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, INDEX IDX_2265B05DB03A8386 (created_by_id), INDEX IDX_2265B05D896DBBDE (updated_by_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE usuario_proyecto (id INT AUTO_INCREMENT NOT NULL, rol_en_proyecto VARCHAR(255) NOT NULL, fecha_asignacion DATETIME NOT NULL, activo TINYINT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, usuario_id INT NOT NULL, proyecto_id INT NOT NULL, tarifa_id INT NOT NULL, INDEX IDX_8713F020DB38439E (usuario_id), INDEX IDX_8713F020F625D1BA (proyecto_id), INDEX IDX_8713F020FE3B76B (tarifa_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE proyecto ADD CONSTRAINT FK_6FD202B9B03A8386 FOREIGN KEY (created_by_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE proyecto ADD CONSTRAINT FK_6FD202B9896DBBDE FOREIGN KEY (updated_by_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE tarea ADD CONSTRAINT FK_3CA05366F625D1BA FOREIGN KEY (proyecto_id) REFERENCES proyecto (id)');
        $this->addSql('ALTER TABLE tarea ADD CONSTRAINT FK_3CA05366DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE tarea ADD CONSTRAINT FK_3CA053669F5A440B FOREIGN KEY (estado_id) REFERENCES tarea_estado (id)');
        $this->addSql('ALTER TABLE usuario ADD CONSTRAINT FK_2265B05DB03A8386 FOREIGN KEY (created_by_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario ADD CONSTRAINT FK_2265B05D896DBBDE FOREIGN KEY (updated_by_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario_proyecto ADD CONSTRAINT FK_8713F020DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario_proyecto ADD CONSTRAINT FK_8713F020F625D1BA FOREIGN KEY (proyecto_id) REFERENCES proyecto (id)');
        $this->addSql('ALTER TABLE usuario_proyecto ADD CONSTRAINT FK_8713F020FE3B76B FOREIGN KEY (tarifa_id) REFERENCES tarifa (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE proyecto DROP FOREIGN KEY FK_6FD202B9B03A8386');
        $this->addSql('ALTER TABLE proyecto DROP FOREIGN KEY FK_6FD202B9896DBBDE');
        $this->addSql('ALTER TABLE tarea DROP FOREIGN KEY FK_3CA05366F625D1BA');
        $this->addSql('ALTER TABLE tarea DROP FOREIGN KEY FK_3CA05366DB38439E');
        $this->addSql('ALTER TABLE tarea DROP FOREIGN KEY FK_3CA053669F5A440B');
        $this->addSql('ALTER TABLE usuario DROP FOREIGN KEY FK_2265B05DB03A8386');
        $this->addSql('ALTER TABLE usuario DROP FOREIGN KEY FK_2265B05D896DBBDE');
        $this->addSql('ALTER TABLE usuario_proyecto DROP FOREIGN KEY FK_8713F020DB38439E');
        $this->addSql('ALTER TABLE usuario_proyecto DROP FOREIGN KEY FK_8713F020F625D1BA');
        $this->addSql('ALTER TABLE usuario_proyecto DROP FOREIGN KEY FK_8713F020FE3B76B');
        $this->addSql('DROP TABLE proyecto');
        $this->addSql('DROP TABLE tarea');
        $this->addSql('DROP TABLE tarea_estado');
        $this->addSql('DROP TABLE tarifa');
        $this->addSql('DROP TABLE usuario');
        $this->addSql('DROP TABLE usuario_proyecto');
    }
}
