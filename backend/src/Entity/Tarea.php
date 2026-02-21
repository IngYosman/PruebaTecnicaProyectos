<?php

namespace App\Entity;

use App\Entity\Traits\SoftDeleteTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\TareaRepository;
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

use Symfony\Component\Serializer\Attribute\Groups;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

#[ORM\Entity(repositoryClass: TareaRepository::class)]
#[ApiFilter(SearchFilter::class, properties: ['proyecto' => 'exact', 'usuario' => 'exact'])]
#[ApiResource(
    operations: [
        new GetCollection(normalizationContext: ['groups' => ['tarea:read', 'timestamp:read']]),
        new Post(
            normalizationContext: ['groups' => ['tarea:read', 'timestamp:read']],
            denormalizationContext: ['groups' => ['tarea:write']]
        ),
        new Get(normalizationContext: ['groups' => ['tarea:read', 'timestamp:read']]),
        new Put(
            normalizationContext: ['groups' => ['tarea:read', 'timestamp:read']],
            denormalizationContext: ['groups' => ['tarea:write']]
        ),
        new Patch(
            normalizationContext: ['groups' => ['tarea:read', 'timestamp:read']],
            denormalizationContext: ['groups' => ['tarea:write']]
        ),
        new Delete(processor: SoftDeleteProcessor::class)
    ],
    normalizationContext: ['groups' => ['tarea:read', 'timestamp:read']],
    denormalizationContext: ['groups' => ['tarea:write']]
)]
class Tarea
{
    use TimestampableTrait;
    use SoftDeleteTrait;
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['tarea:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'tareas')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tarea:read', 'tarea:write'])]
    private ?Proyecto $proyecto = null;

    #[ORM\ManyToOne(inversedBy: 'tareas')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tarea:read', 'tarea:write'])]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'tareas')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tarea:read', 'tarea:write'])]
    private ?TareaEstado $estado = null;

    #[ORM\Column(length: 255)]
    #[Groups(['tarea:read', 'tarea:write'])]
    private ?string $titulo = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['tarea:read', 'tarea:write'])]
    private ?string $descripcion = null;

    #[ORM\Column]
    #[Groups(['tarea:read', 'tarea:write'])]
    private ?int $horasTrabajadas = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }

    public function setUsuario(?Usuario $usuario): static
    {
        $this->usuario = $usuario;

        return $this;
    }

    public function getEstado(): ?TareaEstado
    {
        return $this->estado;
    }

    public function setEstado(?TareaEstado $estado): static
    {
        $this->estado = $estado;

        return $this;
    }

    public function getTitulo(): ?string
    {
        return $this->titulo;
    }

    public function setTitulo(string $titulo): static
    {
        $this->titulo = $titulo;

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

    public function getHorasTrabajadas(): ?int
    {
        return $this->horasTrabajadas;
    }

    public function setHorasTrabajadas(int $horasTrabajadas): static
    {
        $this->horasTrabajadas = $horasTrabajadas;

        return $this;
    }
}
