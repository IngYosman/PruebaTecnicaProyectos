<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Usuario;
use ApiPlatform\Metadata\ApiProperty;

trait BlameableTrait
{
    #[ORM\ManyToOne(targetEntity: Usuario::class)]
    #[ApiProperty(writable: false)]
    private ?Usuario $createdBy = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class)]
    #[ApiProperty(writable: false)]
    private ?Usuario $updatedBy = null;

    public function getCreatedBy(): ?Usuario
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?Usuario $user): self
    {
        $this->createdBy = $user;
        return $this;
    }

    public function getUpdatedBy(): ?Usuario
    {
        return $this->updatedBy;
    }

    public function setUpdatedBy(?Usuario $user): self
    {
        $this->updatedBy = $user;
        return $this;
    }
}