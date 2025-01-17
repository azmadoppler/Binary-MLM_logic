const { sequelize, Package } = require("../models");

exports.getAllPackages = async (req, res, next) => {
  try {
    const allPackagesData = await Package.findAll({});

    res.status(200).json({ allPackagesData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getPackageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const packageData = await Package.findOne({ where: { id: id } });

    if (!packageData) {
      return res.status(400).json({ message: "Package not found" });
    }

    res.status(200).json({ packageData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createPackage = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, price, duration } = req.body;
    let { description } = req.body;

    if (!name || !name.trim()) {
      throw new CustomError(400, "Name is require");
    }
    if (!price || !price.trim()) {
      throw new CustomError(400, "Price is require");
    }
    if (!+price > 0) {
      throw new CustomError(400, "Price must be int and not minus");
    }
    if (!duration || !duration.trim()) {
      throw new CustomError(400, "Duration is require");
    }

    if (!description || !description.trim()) {
      description = null;
    }

    const createPackage = await Package.create(
      {
        name: name,
        description: description,
        price: price,
        duration: duration,
      },
      {
        transaction: transaction,
      }
    );

    await transaction.commit();

    res
      .status(201)
      .json({ message: "Create new package successful", createPackage });
  } catch (error) {
    await transaction.rollback();

    console.log(error);

    next(error);
  }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { name, description, price, duration } = req.body;

    if (
      (!name && !description && !price && !duration) ||
      (!name.trim() && !description.trim() && !price.trim() && !duration.trim())
    ) {
      return res.status(400).json({
        message: "All value are empty, nothing to update",
      });
    }

    const oldPackageData = await Package.findOne({ where: { id: id } });

    if (!oldPackageData) {
      return res.status(400).json({ message: "Package not found" });
    }

    if (!name || !name.trim()) {
      name = oldPackageData.name;
    }
    if (!description || !description.trim()) {
      description = oldPackageData.description;
    }
    if (!price || !price.trim()) {
      price = oldPackageData.price;
    }
    if (!+price > 0) {
      return res
        .status(400)
        .json({ message: "Price must be int and not minus" });
    }
    if (!duration || !duration.trim()) {
      duration = oldPackageData.duration;
    }

    const updatePackage = await Package.update(
      {
        name: name,
        description: description,
        price: price,
        duration: duration,
      },
      {
        where: { id: id },
      }
    );

    if (!updatePackage) {
      return res.status(500).json({ message: "Internal server error" });
    }

    const updatedPackage = await Package.findOne({ where: { id: id } });

    res.status(200).json({
      message: "Update package successful",
      updatedPackage,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
