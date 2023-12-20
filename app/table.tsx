import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  Text,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Flex,
  Title,
  Badge,
} from "@tremor/react";


export default function DataTable({ columns, columnNames, data }: { columns: any[], columnNames: string[], data: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
  
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
  
    return (
      <>
      <Card className="relative max-w-xl mx-auto h-96 overflow-hidden">
      <Flex justifyContent="start" className="space-x-2">
                    <Title>Top Emails</Title>
                  </Flex>
        <Table>
          <TableHead>
            <TableRow>
              {columnNames.map((item) => (<TableHeaderCell key={item}>{item}</TableHeaderCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row["id"]}>
                {columns.map((column) => 
                  <TableCell key={column}>{row[column]}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                  <div className="relative mt-3">
                  <Flex justifyContent="start" className="space-x-2">
                    <Title>Top Emails</Title>
                  </Flex>
                    <Table className="h-[450px]">
                      <TableHead>
                        <TableRow>
                          {columnNames.map((item) => (<TableHeaderCell key={item} className="bg-white">{item}</TableHeaderCell>))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((row) => (
                          <TableRow key={row["id"]}>
                            {columns.map((column) => <TableCell key={column}>{row[column]}</TableCell>)}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button
                    className="mt-5 w-full bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
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
