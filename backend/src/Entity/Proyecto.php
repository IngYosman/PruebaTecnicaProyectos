<?php

namespace App\Entity;

use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\SoftDeleteTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\ProyectoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\State\SoftDeleteProcessor;

#[ORM\Entity(repositoryClass: ProyectoRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(),
        new Get(),
        new Put(),
        new Patch(),
        new Delete(processor: SoftDeleteProcessor::class)
    ]
)]
class Proyecto
{
    use BlameableTrait;
    use SoftDeleteTrait;
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nombre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $descripcion = null;

    #[ORM\Column]
    private ?\DateTime $fechaInicio = null;

    #[ORM\Column]
    private ?\DateTime $fechaFin = null;

    #[ORM\Column]
    private ?bool $estado = null;

    /**
     * @var Collection<int, UsuarioProyecto>
     */
    #[ORM\OneToMany(targetEntity: UsuarioProyecto::class, mappedBy: 'proyecto')]
    private Collection $usuarioProyectos;

    /**
     * @var Collection<int, Tarea>
     */
    #[ORM\OneToMany(targetEntity: Tarea::class, mappedBy: 'proyecto')]
    private Collection $tareas;

    public function __construct()
    {
        $this->usuarioProyectos = new ArrayCollection();
        $this->tareas = new ArrayCollection();
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

    public function getFechaInicio(): ?\DateTime
    {
        return $this->fechaInicio;
    }

    public function setFechaInicio(\DateTime $fechaInicio): static
    {
        $this->fechaInicio = $fechaInicio;

        return $this;
    }

    public function getFechaFin(): ?\DateTime
    {
        return $this->fechaFin;
    }

    public function setFechaFin(\DateTime $fechaFin): static
    {
        $this->fechaFin = $fechaFin;

        return $this;
    }

    public function isEstado(): ?bool
    {
        return $this->estado;
    }

    public function setEstado(bool $estado): static
    {
        $this->estado = $estado;

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
            $usuarioProyecto->setProyecto($this);
        }

        return $this;
    }

    public function removeUsuarioProyecto(UsuarioProyecto $usuarioProyecto): static
    {
        if ($this->usuarioProyectos->removeElement($usuarioProyecto)) {
            // set the owning side to null (unless already changed)
            if ($usuarioProyecto->getProyecto() === $this) {
                $usuarioProyecto->setProyecto(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Tarea>
     */
    public function getTareas(): Collection
    {
        return $this->tareas;
    }

    public function addTarea(Tarea $tarea): static
    {
        if (!$this->tareas->contains($tarea)) {
            $this->tareas->add($tarea);
            $tarea->setProyecto($this);
        }

        return $this;
    }

    public function removeTarea(Tarea $tarea): static
    {
        if ($this->tareas->removeElement($tarea)) {
            // set the owning side to null (unless already changed)
            if ($tarea->getProyecto() === $this) {
                $tarea->setProyecto(null);
            }
        }

        return $this;
    }
}
