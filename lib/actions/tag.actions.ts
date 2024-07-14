/* eslint-disable no-unused-vars */
"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,

} from "./shared.types";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";


export async function getAllTags(params: GetAllTagsParams) {
    try {
      connectToDatabase();
    //   const { searchQuery, filter, page = 1, pageSize = 10 } = params;
        const totalTags = await Tag.find({});
        return { tags: totalTags };
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  
export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    
    const tag = await Tag.findOne({_id:tagId}).populate({
      path: "questions",
      model: Question,
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!tag) {
      throw new Error("Tag not found");
    }
    
    const questions = tag.questions;
    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.error(error);
    throw error;
  }
}