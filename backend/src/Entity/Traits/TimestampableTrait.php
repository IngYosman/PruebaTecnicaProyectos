<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiProperty;

trait TimestampableTrait
{
    #[ORM\Column(type: 'datetime_immutable')]
    #[ApiProperty(writable: false)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[ApiProperty(writable: false)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $date): self
    {
        $this->createdAt = $date;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $date): self
    {
        $this->updatedAt = $date;
        return $this;
    }
}