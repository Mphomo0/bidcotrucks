import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface Link {
  href: string
  text: string
}

interface PageWrapperProps {
  title: string
  link: Link
  heading: string
}

const PageWrapper: React.FC<PageWrapperProps> = ({ heading, title, link }) => {
  return (
    <div className='relative w-full h-[60vh] md:h-[50vh] lg:h-[70vh] bg-[url("/images/bg/allBg.jpg")] bg-cover bg-center text-white flex flex-col justify-center items-center px-4 md:px-10'>
      <div className='absolute inset-0 bg-black opacity-90'></div>

      <div className='max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row items-center justify-between px-4 sm:px-6 md:px-8 relative z-10'>
        {/* Heading and Title on left */}
        <div className='order-2 md:order-1 text-center md:text-left lg:text-left md:mr-10'>
          <p className='text-red-500 uppercase tracking-widest font-semibold text-sm'>
            {heading}
          </p>
          <h1 className='text-5xl md:text-5xl lg:text-7xl font-bold mt-2'>
            {title}
          </h1>
        </div>

        {/* Breadcrumb on right for desktop, bottom for mobile */}
        <div className='order-1 md:order-2 mt-4 md:mt-0 md:ml-10'>
          <Breadcrumb className='text-red-700 font-bold'>
            <BreadcrumbList className='flex space-x-2'>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={link.href}>{link.text}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  )
}

export default PageWrapper
