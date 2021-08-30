<?php

namespace App\Repositories;

interface RepositoryInterface
{
    /**
     * Get all
     * @return mixed
     */
    public function getAll();

    /**
     * Get one
     * @param int $id
     * @return mixed
     */
    public function findById(int $id);

    /**
     * Get by field
     * @param string $column
     * @param any $value
     * @return mixed
     */
    public function findByField(string $column, any $value);

    /**
     * Create
     * @param array $attributes
     * @return mixed
     */
    public function create(array $attributes);

    /**
     * Update
     * @param int $id
     * @param array $attributes
     * @return mixed
     */
    public function update(int $id, array $attributes);

    /**
     * Create or update a record matching the attributes, and fill it with values.
     * @param array $attributes
     * @param array $values
     * @return mixed
     */
    public function updateOrCreate(array $attributes, array $values = []);

    /**
     * Delete
     * @param int $id
     * @return mixed
     */
    public function delete(int $id);
}
