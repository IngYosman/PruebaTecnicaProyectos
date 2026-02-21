<?php

namespace App\Entity;

use App\Entity\Traits\TimestampableTrait;
use App\Repository\TarifaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TarifaRepository::class)]
class Tarifa
{
    use TimestampableTrait;
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nombre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $descripcion = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 2, scale: 0)]
    private ?string $valorPorHora = null;

    #[ORM\Column(length: 255)]
    private ?string $moneda = null;

    #[ORM\Column]
    private ?bool $activa = null;

    /**
     * @var Collection<int, UsuarioProyecto>
     */
    #[ORM\OneToMany(targetEntity: UsuarioProyecto::class, mappedBy: 'tarifa')]
    private Collection $usuarioProyectos;

    public function __construct()
    {
        $this->usuarioProyectos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getValorPorHora(): ?string
    {
        return $this->valorPorHora;
    }

    public function setValorPorHora(string $valorPorHora): static
    {
        $this->valorPorHora = $valorPorHora;

        return $this;
    }

    public function getMoneda(): ?string
    {
        return $this->moneda;
    }

    public function setMoneda(string $moneda): static
    {
        $this->moneda = $moneda;

        return $this;
    }

    public function isActiva(): ?bool
    {
        return $this->activa;
    }

    public function setActiva(bool $activa): static
    {
        $this->activa = $activa;

        return $this;
    }

    /**
     * @return Collection<int, UsuarioProyecto>
     */
    public function getUsuarioProyectos(): Collection
    {
        return $this->usuarioProyectos;
    }

    public function addUsuarioProyecto(UsuarioProyecto $usuarioProyecto): static
    {
        if (!$this->usuarioProyectos->contains($usuarioProyecto)) {
            $this->usuarioProyectos->add($usuarioProyecto);
            $usuarioProyecto->setTarifa($this);
        }

        return $this;
    }

    public function removeUsuarioProyecto(UsuarioProyecto $usuarioProyecto): static
    {
        if ($this->usuarioProyectos->removeElement($usuarioProyecto)) {
            // set the owning side to null (unless already changed)
            if ($usuarioProyecto->getTarifa() === $this) {
                $usuarioProyecto->setTarifa(null);
            }
        }

        return $this;
    }
}
