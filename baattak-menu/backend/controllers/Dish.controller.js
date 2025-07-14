import Dish from '../models/Dish.model.js';

const DishController = {
  // Get all dishes
  getAll: async (req, res) => {
    try {
      const dishes = await Dish.find();
      res.json(dishes);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching dishes', error: err.message });
    }
  },
  // Create a new dish
  create: async (req, res) => {
    try {
      const { name, price, description, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const dish = new Dish({ name, price, description, imageUrl, category });
      await dish.save();
      res.status(201).json(dish);
    } catch (err) {
      res.status(400).json({ message: 'Error creating dish', error: err.message });
    }
  },
  // Update a dish
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Dish.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Dish not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: 'Error updating dish', error: err.message });
    }
  },
  // Delete a dish
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Dish.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Dish not found' });
      res.json({ message: 'Dish deleted' });
    } catch (err) {
      res.status(400).json({ message: 'Error deleting dish', error: err.message });
    }
  },
};

export default DishController; 