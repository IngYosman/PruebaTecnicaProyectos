<?php

namespace App\EventSubscriber;

use App\Entity\Usuario;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
class HashPasswordSubscriber
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function prePersist(LifecycleEventArgs $args): void
    {
        $this->handleEvent($args);
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {
        $this->handleEvent($args);
    }

    private function handleEvent(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Usuario) {
            return;
        }

        $this->hashPassword($entity);
    }

    private function hashPassword(Usuario $user): void
    {
        $plainPassword = $user->getPlainPassword();
        if ($plainPassword) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
            $user->setPlainPassword(null);
        }
    }
}
