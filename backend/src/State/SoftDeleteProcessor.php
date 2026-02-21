<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Doctrine\ORM\EntityManagerInterface;

final class SoftDeleteProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (method_exists($data, 'setDeletedAt')) {
            $data->setDeletedAt(new \DateTimeImmutable());
        }

        try {
            $reflection = new \ReflectionClass(get_class($data));
            
            // PARA LAS PROPIEDADES DE ESTADO
            if ($reflection->hasProperty('estado')) {
                $prop = $reflection->getProperty('estado');
                $type = $prop->getType();
                if ($type && $type->getName() === 'bool') {
                    if (method_exists($data, 'setEstado')) {
                        $data->setEstado(false);
                    }
                }
            }
        } catch (\ReflectionException $e) {
            
        }
       
        $this->entityManager->flush();
        return null;
    }
}
