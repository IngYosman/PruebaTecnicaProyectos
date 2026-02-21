<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiProperty;

trait SoftDeleteTrait
{
    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[ApiProperty(writable: false)]
    private ?\DateTimeImmutable $deletedAt = null;

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTimeImmutable $date): self
    {
        $this->deletedAt = $date;
        return $this;
    }

    public function isDeleted(): bool
    {
        return null !== $this->deletedAt;
    }
}