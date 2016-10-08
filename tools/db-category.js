process.env.NODE_ENV = process.env.NODE_ENV || "development";

import winston from "winston";
import {processValidationError} from "../server/utils/error";

import CategoryController from "../server/controllers/blog/category.js";


const categoryController = new CategoryController();
categoryController.remove()
	.then(result => {
		winston.debug("removed:", result);

		return categoryController
			.create([{
				title: "Books",
				categoryId: "books"
			}, {
				title: "Cars",
				categoryId: "cars"
			}])
			.then(category1 => {
				return categoryController
					.create([{
						title: "Programming",
						categoryId: "programming",
						parent: category1[0]._id
					}, {
						title: "Cooking",
						categoryId: "cooking",
						parent: category1[0]._id
					}, {
						title: "Lyrics",
						categoryId: "lyrics",
						parent: category1[0]._id
					}, {
						title: "Tata Motors",
						categoryId: "tata_motors",
						parent: category1[1]._id
					}, {
						title: "BMW",
						categoryId: "bmw",
						parent: category1[1]._id
					}, {
						title: "Ford",
						categoryId: "ford",
						parent: category1[1]._id
					}])
					.then(category2 => {
						return categoryController
							.create([{
								title: "PHP",
								categoryId: "php",
								parent: category2[0]._id
							}, {
								title: "Java",
								categoryId: "java",
								parent: category2[0]._id
							}, {
								title: "javascript",
								categoryId: "ecmascript",
								parent: category2[0]._id
							}, {
								title: "1000+ soups",
								categoryId: "1000__soups",
								parent: category2[1]._id
							}, {
								title: "Raw vegan food",
								categoryId: "raw_vegan_food",
								parent: category2[1]._id
							}, {
								title: "Pastry",
								categoryId: "pastry",
								parent: category2[1]._id
							}, {
								title: "Pushkin",
								categoryId: "pushkin",
								parent: category2[2]._id
							}, {
								title: "Akhmatova",
								categoryId: "akhmatova",
								parent: category2[2]._id
							}, {
								title: "Kobzon",
								categoryId: "kobzon",
								parent: category2[2]._id
							}, {
								title: "Land Rover",
								categoryId: "land_rover",
								parent: category2[3]._id
							}, {
								title: "Range Rover",
								categoryId: "land_rover",
								parent: category2[3]._id
							}, {
								title: "Land Cruiser",
								categoryId: "land_cruiser",
								parent: category2[3]._id
							}, {
								title: "BMW 7",
								categoryId: "bmw_7",
								parent: category2[4]._id
							}])
							.then(category3 => ([...category1, ...category2, ...category3]));
					});
			});
	})
	.then(result => {
		winston.info("OK");
		winston.debug(result.length);
	})
	.catch(e => {
		winston.info("FAIL");
		if (e.name === "ValidationError") {
			winston.debug(processValidationError(e));
		} else {
			winston.debug(e);
		}
	})
	.done(() => {
		winston.info("DONE");
		process.exit(0);
	});
