<?php

namespace App\Entity;

use App\Entity\Traits\TimestampableTrait;
use App\Repository\UsuarioProyectoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioProyectoRepository::class)]
class UsuarioProyecto
{
    use TimestampableTrait;
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioProyectos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioProyectos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Proyecto $proyecto = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioProyectos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Tarifa $tarifa = null;

    #[ORM\Column(length: 255)]
    private ?string $rolEnProyecto = null;

    #[ORM\Column]
    private ?\DateTime $fechaAsignacion = null;

    #[ORM\Column]
    private ?bool $activo = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }

    public function setUsuario(?Usuario $usuario): static
    {
        $this->usuario = $usuario;

        return $this;
    }

    public function getProyecto(): ?Proyecto
    {
        return $this->proyecto;
    }

    public function setProyecto(?Proyecto $proyecto): static
    {
        $this->proyecto = $proyecto;

        return $this;
    }

    public function getTarifa(): ?Tarifa
    {
        return $this->tarifa;
    }

    public function setTarifa(?Tarifa $tarifa): static
    {
        $this->tarifa = $tarifa;

        return $this;
    }

    public function getRolEnProyecto(): ?string
    {
        return $this->rolEnProyecto;
    }

    public function setRolEnProyecto(string $rolEnProyecto): static
    {
        $this->rolEnProyecto = $rolEnProyecto;

        return $this;
    }

    public function getFechaAsignacion(): ?\DateTime
    {
        return $this->fechaAsignacion;
    }

    public function setFechaAsignacion(\DateTime $fechaAsignacion): static
    {
        $this->fechaAsignacion = $fechaAsignacion;

        return $this;
    }

    public function isActivo(): ?bool
    {
        return $this->activo;
    }

    public function setActivo(bool $activo): static
    {
        $this->activo = $activo;

        return $this;
    }
}
