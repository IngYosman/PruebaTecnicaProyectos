<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiProperty;
use Symfony\Component\Serializer\Attribute\Groups;

trait TimestampableTrait
{
    #[ORM\Column(type: 'datetime_immutable')]
    #[ApiProperty(writable: false)]
    #[Groups(['timestamp:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[ApiProperty(writable: false)]
    #[Groups(['timestamp:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[Groups(['timestamp:read'])]
    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $date): self
    {
        $this->createdAt = $date;
        return $this;
    }

    #[Groups(['timestamp:read'])]
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