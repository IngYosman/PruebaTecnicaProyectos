<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260221180731 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tarea_estado CHANGE activo estado TINYINT NOT NULL');
        $this->addSql('ALTER TABLE tarifa CHANGE activa estado TINYINT NOT NULL');
        $this->addSql('ALTER TABLE usuario_proyecto CHANGE activo estado TINYINT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tarea_estado CHANGE estado activo TINYINT NOT NULL');
        $this->addSql('ALTER TABLE tarifa CHANGE estado activa TINYINT NOT NULL');
        $this->addSql('ALTER TABLE usuario_proyecto CHANGE estado activo TINYINT NOT NULL');
    }
}
