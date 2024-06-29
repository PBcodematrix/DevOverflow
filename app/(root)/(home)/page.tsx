import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import Link from 'next/link'
import React from 'react'


const questions=[
  {
    _id: "1",
    title: "How do I implement a binary search algorithm in Python?",
    tags: ["Python", "Algorithms", "Binary Search"],
    author: "user123",
    upvotes: 45,
    downvotes: 2,
    views: 1500,
    answers: 3,
    createdAt: new Date("2024-06-01T10:00:00Z")
  },
  {
    _id: "2",
    title: "What is the difference between abstract class and interface in Java?",
    tags: ["Java", "OOP", "Abstract Class", "Interface"],
    author: "coder456",
    upvotes: 80,
    downvotes: 5,
    views: 2300,
    answers: 5,
    createdAt: new Date("2024-06-02T12:30:00Z")
  },
  {
    _id: "3",
    title: "How can I optimize my SQL query for better performance?",
    tags: ["SQL", "Database", "Optimization"],
    author: "dbadmin789",
    upvotes: 60,
    downvotes: 3,
    views: 1750,
    answers: 4,
    createdAt: new Date("2024-06-03T15:45:00Z")
  },
  {
    _id: "4",
    title: "What are the new features in JavaScript ES2021?",
    tags: ["JavaScript", "ES2021", "Programming"],
    author: "dev_guru",
    upvotes: 70,
    downvotes: 1,
    views: 2000,
    answers: 6,
    createdAt: new Date("2024-06-04T09:20:00Z")
  },
  {
    _id: "5",
    title: "How to handle state management in React?",
    tags: ["React", "State Management", "JavaScript"],
    author: "frontend_dev",
    upvotes: 85,
    downvotes: 4,
    views: 2500,
    answers: 8,
    createdAt: new Date("2024-06-05T11:10:00Z")
  }
]
;
const Home = () => {
  // const results =
  return (
    <>
    <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
      <h1 className='h1-bold text-dark100_light900'>All Questions</h1> 
      <Link href='/ask-question' className='flex justify-end max-sm:w-full '>
      <Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900 '>
        Ask a Question
      </Button>
      </Link>
    </div>
    <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
      <LocalSearchbar
        route="/"
        iconPosition="left"
        imgSrc="/assets/icons/search.svg"
        placeholder="Search for Questions"
        otherClasses="flex-1"
      />
      <Filter 
        filters={HomePageFilters}
        otherClasses="min-h-[56px] sm:min-w-[170px]"
        containerClasses="hidden max-md:flex"
      />  
    </div>
      <HomeFilters/>
      
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
           questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              // clerkId={clerkId}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="No Questions Found"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  )
}

export default Home