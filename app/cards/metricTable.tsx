import { Fragment, useState } from "react";
import { Button, Card, Flex, TextInput, BarList, Title, Icon } from "@tremor/react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowsPointingOutIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from '@heroicons/react/24/solid';

  //const valueFormatter = (number:any) => `${Intl.NumberFormat("us").format(number).toString()}`;
  
  export default function MetricTable({ 
    data, 
    metric,
    metricName, 
    grouper, 
    grouperName, 
    title, 
    tooltip,
    valueFormatter,
    hideFn,
  }: { 
    data: any[],
    metric: string,
    metricName: string,
    grouper: string,
    grouperName: string,
    title: string,
    tooltip: string,
    valueFormatter: (arg0: any) => string,
    hideFn: undefined | ((sender:string) => void),
  }) {

    const sizeByFrom = data.reduce((sizeByFrom, nextMessage) => {
      if(!sizeByFrom[nextMessage[grouper]]) {
        sizeByFrom[nextMessage[grouper]] = 0;
      }
      sizeByFrom[nextMessage[grouper]] += nextMessage[metric];
      return sizeByFrom;
    }, {});

    var pages:any[] = [];
    for (const [key, value] of Object.entries<number>(sizeByFrom)) {
      pages.push({
        name: key,
        value: value,
        icon: function ico(){
          return (hideFn && <Icon
            className="cursor-pointer"
            icon={EyeSlashIcon}
            tooltip="Hide this item from this tool."
            size="xs"
            onClick={() => {
              hideFn
                ? hideFn(key)
                : alert('Hiding is disabled.');
            }}
          ></Icon>)
        }
      })
    }

    pages = pages.sort((a,b) => b.value - a.value);

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredpages = pages.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const closeModal = () => setIsOpen(false);
    const openModal = () => setIsOpen(true);
    return(
      <>
        <Card className="max-w-xl mx-auto h-96">
        <Flex justifyContent="start" className="space-x-2 mb-4">
          <Title>{title}</Title>
          <Icon icon={InformationCircleIcon} color="stone" tooltip={tooltip} />
        </Flex>
          <BarList
            data={pages.slice(0, 5)}
            className=""
            showAnimation={false}
            valueFormatter={valueFormatter}
          />
          <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-12 pb-8 absolute rounded-b-lg">
            <Button
              icon={ArrowsPointingOutIcon}
              className="bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
              onClick={openModal}
            >
              Show more
            </Button>
          </div>
        </Card>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900 bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className="w-full max-w-xl transform overflow-hidden ring-tremor bg-white
                                      p-6 text-left align-middle shadow-tremor transition-all rounded-xl"
                  >
                    <Flex justifyContent="start" className="space-x-2 mb-4">
                      <Title>{title}</Title>
                    </Flex>
                  
                    <TextInput
                      icon={MagnifyingGlassIcon}
                      placeholder="Search..."
                      className="mt-4"
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    
                    <div className="relative mt-4 h-[450px] overflow-y-scroll">
                      <BarList
                        data={filteredpages}
                        className="mr-4" // to give room for scrollbar
                        showAnimation={false}
                        valueFormatter={valueFormatter}
                      />
                      <div className="sticky inset-x-0 bottom-0 p-6 bg-gradient-to-t from-white to-transparent h-20" />
                    </div>
                    <Button
                      className="mt-2 w-full bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                      onClick={closeModal}
                    >
                      Go back
                    </Button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  }