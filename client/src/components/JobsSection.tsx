import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Job } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface JobsSectionProps {
  onViewJobDetails: (job: Job) => void;
}

const JobsSection = ({ onViewJobDetails }: JobsSectionProps) => {
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState({
    locations: {
      Remote: false,
      Global: false,
      US: false
    },
    departments: {
      Marketing: true,
      Engineering: false,
      Product: false, 
      Design: false,
      "Data Science": false,
    },
    salaryRanges: {
      "50k-80k": false,
      "80k-120k": true,
      "120k-160k": false,
      "160k+": false
    }
  });

  useEffect(() => {
    if (!jobs) return;
    
    const filtered = jobs.filter((job: Job) => {
      // Location filter
      const locationFilter = Object.entries(filters.locations).some(([key, value]) => {
        if (!value) return false;
        if (key === "Remote" && job.isRemote) return true;
        return job.location.includes(key);
      });
      
      // Department filter
      const departmentFilter = Object.entries(filters.departments).some(([key, value]) => {
        if (!value) return false;
        return job.department.includes(key) || job.category.includes(key);
      });
      
      // Salary filter
      const salaryFilter = Object.entries(filters.salaryRanges).some(([key, value]) => {
        if (!value) return false;
        const [min, max] = key.split("-");
        if (key === "160k+") {
          return job.minSalary >= 160000;
        }
        return (
          job.minSalary >= parseInt(min.replace("k", "000")) && 
          job.maxSalary <= parseInt(max.replace("k", "000"))
        );
      });
      
      // If no filters are selected in a category, don't filter by that category
      const anyLocationSelected = Object.values(filters.locations).some(Boolean);
      const anyDepartmentSelected = Object.values(filters.departments).some(Boolean);
      const anySalarySelected = Object.values(filters.salaryRanges).some(Boolean);
      
      return (
        (!anyLocationSelected || locationFilter) && 
        (!anyDepartmentSelected || departmentFilter) && 
        (!anySalarySelected || salaryFilter)
      );
    });
    
    setFilteredJobs(filtered);
  }, [jobs, filters]);

  const handleFilterChange = (category: 'locations' | 'departments' | 'salaryRanges', key: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]],
      }
    }));
  };

  const formatSalary = (min: number, max: number) => {
    return `$${min/1000}k - $${max/1000}k per year`;
  };

  return (
    <section id="jobs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-center">Open Positions</h2>
        
        <div className="flex flex-col lg:flex-row">
          {/* Filter Panel */}
          <div className="lg:w-1/4 mb-8 lg:mb-0 pr-0 lg:pr-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4">Filter By</h3>
              
              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Location</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="remote" 
                      checked={filters.locations.Remote}
                      onCheckedChange={() => handleFilterChange('locations', 'Remote')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="remote" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Remote
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="us" 
                      checked={filters.locations.US}
                      onCheckedChange={() => handleFilterChange('locations', 'US')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="us" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      US
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="global" 
                      checked={filters.locations.Global}
                      onCheckedChange={() => handleFilterChange('locations', 'Global')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="global" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Global
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Department Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Department</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="marketing" 
                      checked={filters.departments.Marketing}
                      onCheckedChange={() => handleFilterChange('departments', 'Marketing')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="marketing" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Marketing
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="engineering" 
                      checked={filters.departments.Engineering}
                      onCheckedChange={() => handleFilterChange('departments', 'Engineering')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="engineering" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Engineering
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="product" 
                      checked={filters.departments.Product}
                      onCheckedChange={() => handleFilterChange('departments', 'Product')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="product" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Product
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="design" 
                      checked={filters.departments.Design}
                      onCheckedChange={() => handleFilterChange('departments', 'Design')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="design" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Design
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="data-science" 
                      checked={filters.departments["Data Science"]}
                      onCheckedChange={() => handleFilterChange('departments', 'Data Science')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="data-science" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Data Science
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Salary Range Filter */}
              <div>
                <h4 className="font-semibold mb-2">Salary Range</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="50k-80k" 
                      checked={filters.salaryRanges["50k-80k"]}
                      onCheckedChange={() => handleFilterChange('salaryRanges', '50k-80k')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="50k-80k" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      $50k - $80k
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="80k-120k" 
                      checked={filters.salaryRanges["80k-120k"]}
                      onCheckedChange={() => handleFilterChange('salaryRanges', '80k-120k')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="80k-120k" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      $80k - $120k
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="120k-160k" 
                      checked={filters.salaryRanges["120k-160k"]}
                      onCheckedChange={() => handleFilterChange('salaryRanges', '120k-160k')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="120k-160k" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      $120k - $160k
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="160k+" 
                      checked={filters.salaryRanges["160k+"]}
                      onCheckedChange={() => handleFilterChange('salaryRanges', '160k+')}
                      className="text-whatsapp-green data-[state=checked]:bg-whatsapp-green data-[state=checked]:border-whatsapp-green"
                    />
                    <label htmlFor="160k+" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      $160k+
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="lg:w-3/4">
            <div className="space-y-4">
              {isLoading ? (
                // Loading state
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="w-full">
                        <Skeleton className="h-7 w-48 mb-2" />
                        <Skeleton className="h-5 w-64 mb-2" />
                        <Skeleton className="h-5 w-40 mb-3" />
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Skeleton className="h-10 w-28" />
                      </div>
                    </div>
                  </div>
                ))
              ) : error ? (
                // Error state
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <p className="text-red-500">Unable to load jobs. Please try again later.</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                // Empty state
                <div className="bg-white p-6 rounded-lg text-center">
                  <p className="text-gray-500 mb-2">No jobs match your current filters</p>
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      locations: {Remote: false, Global: false, US: false},
                      departments: {Marketing: true, Engineering: false, Product: false, Design: false, "Data Science": false},
                      salaryRanges: {"50k-80k": false, "80k-120k": true, "120k-160k": false, "160k+": false}
                    })}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                // Job listings
                filteredJobs.map((job: Job) => (
                  <div 
                    key={job.id} 
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="font-bold text-xl mb-1">{job.title}</h3>
                        <p className="text-gray-600 mb-3">
                          {job.location} | {job.department}
                        </p>
                        <p className="text-whatsapp-darkgreen font-medium mb-3">
                          {formatSalary(job.minSalary, job.maxSalary)}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button 
                          onClick={() => onViewJobDetails(job)}
                          className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsSection;
