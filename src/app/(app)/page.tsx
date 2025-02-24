'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

import messages from "../../messages.json"

const Home = () => {
  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center'>
        <h1 className='text-3xl md:text-5xl font-bold'>Secrets, Feedback, Confessions — Delivered Anonymously!</h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore AnonymFeeds</p>
      </section>
      <Carousel
      opts={{
        align: "start",
      }}
      plugins={[Autoplay({delay:3000})]}
      className="w-9/12 mt-6"
    >
      <CarouselContent>
        {
          messages.map((message, index)=>(
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardHeader>
                  {message.title}
                </CardHeader>
                <CardContent className="flex flex-col min-h-52 justify-between p-6">
                  <span className="text-lg font-semibold">{message.content}</span>
                  <span className="font-light">{message.received}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6">&copy; 2025 AnonymFeeds. All rights reserved.</footer>
    </>
  )
}

export default Home