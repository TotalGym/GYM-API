exports.search = (model, searchTerm) => {
    if (!searchTerm) return {};
    const searchableFields = Object.keys(model.schema.paths).filter((field) => {
      const fieldType = model.schema.paths[field].instance;
      // console.log(fieldType);
        return fieldType === 'String'; 
    });
    return {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    };
  };