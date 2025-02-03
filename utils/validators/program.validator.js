const yup = require("yup");

exports.createProgramValidation = {
    body: yup.object({
      programName: yup.string().required("Program name is required"),
      exercises: yup
        .array()
        .of(
          yup.object({
            name: yup.string().required("Exercise name is required"),
            sets: yup
              .number()
              .positive("Sets must be a positive number")
              .required("Number of sets is required"),
            repetitions: yup
              .number()
              .positive("Repetitions must be a positive number")
              .required("Number of repetitions is required"),
          })
        )
        .required("Exercises are required"),
      description: yup.string().required("Description is required"),
      monthlyPrice: yup.number().positive("Monthly price must be positive").optional(),
      annuallyPrice: yup.number().positive("Annually price must be positive").optional(),
      image: yup.string(),
      schedule: yup
        .array()
        .of(
          yup.object({
            day: yup.string().required("Day is required"),
            startTime: yup.string().required("Start time is required"),
            endTime: yup.string().required("End time is required"),
          })
        )
        .required("Schedule is required"),
    }),
  };
  
  exports.updateProgramValidation = {
    body: yup.object({
      programName: yup.string().optional(),
      exercises: yup.array().of(
        yup.object({
          name: yup.string().optional(),
          sets: yup.number().positive("Sets must be a positive number").optional(),
          repetitions: yup.number().positive("Repetitions must be a positive number").optional(),
        })
      ).optional(),
      description: yup.string().optional(),
      monthlyPrice: yup.number().positive("Monthly price must be positive").optional(),
      annuallyPrice: yup.number().positive("Annually price must be positive").optional(),
      image: yup.string().optional(),
      schedule: yup.array().of(
        yup.object({
          day: yup.string().optional(),
          startTime: yup.string().optional(),
          endTime: yup.string().optional(),
        })
      ).optional(),
    }),
  };
  