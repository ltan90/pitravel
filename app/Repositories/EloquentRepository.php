<?php

namespace App\Repositories;

use App\Repositories\RepositoryInterface;
use http\Exception;

abstract class EloquentRepository implements RepositoryInterface
{
    /**
     * @var \Illuminate\Database\Eloquent\Model
     */
    protected $_model;

    /**
     * EloquentRepository constructor.
     */
    public function __construct()
    {
        $this->setModel();
    }

    /**
     * get model
     * @return string
     */
    abstract public function getModel();

    /**
     * Set model
     */
    public function setModel()
    {
        $this->_model = app()->make(
            $this->getModel()
        );
    }

    /**
     * Get All
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getAll()
    {
        return $this->_model->all();
    }

    /**
     * Get one
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        return $this->_model->find($id);
    }

    /**
     * Get by field
     * @param string $column
     * @param any $value
     * @return mixed
     */
    public function findByField(string $column, any $value)
    {
        $result = $this->_model->where($column, $value)->get();

        return $result;
    }

    /**
     * Create
     * @param array $attributes
     * @return mixed
     */
    public function create(array $attributes)
    {
        return $this->_model->create($attributes);
    }

    /**
     * Update
     * @param int $id
     * @param array $attributes
     * @return bool|mixed
     */
    public function update(int $id, array $attributes)
    {
        $result = $this->findById($id);
        if (!$result) return;

        $result->update($attributes);

        return $result;
    }

    /**
     * Create or update a record matching the attributes, and fill it with values.
     * @param array $attributes
     * @param array $values
     * @return mixed
     */
    public function updateOrCreate(array $attributes, array $values = [])
    {
        $result = $this->_model->updateOrCreate($attributes, $values);

        return $result;
    }
    /**
     * Delete
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id)
    {
        $result = $this->findById($id);
        if (! $result) return;

        return $result->delete();
    }

}
