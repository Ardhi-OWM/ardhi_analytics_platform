"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveUpRight } from 'lucide-react';

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Seamless Visualizations",
    href: "/",
    description:
      "Visualize data and analytics from models on open-source and other basemaps directly within the platform.",
  },
  {
    title: "Geospatial Data Coverter",
    href: "/converter",
    description:
      "Transform your data to your desired format.",
  },
  {
    title: "Results Download",
    href: "/download",
    description:
      "Export your analytics and download in your desired format.",
  },
  {
    title: "Customizable Code",
    href: "https://github.com/Ardhi-OWM/ardhi_supabase_clerk_latest",
    description: "Access our open-source code and tailor it to your needs.",
  },

];

export default function NavigationMenuPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="flex flex-col items-center justify-center mb-8 ">
        <h1 className="text-2xl font-bold mb-6 mx-3 text-gray-400">
          Welcome to the WebGIS Platform of
          {" "}
          <span className="inline-block relative ml-1">
            Ardhi!{" "}
            <Image src="/curve.png"
              alt="Curve"
              className="absolute top-full left-0 w-full xl:-mt-2"
              width={624}
              height={28}
            />
          </span></h1>
        <Link href="/dashboard" passHref className="px-4 flex items-center space-x-2 text-xs ">
          <span className="align-middle underline underline-offset-4 text-green-500 hover:text-green-300 ">TO DASHBOARD</span>
          <MoveUpRight className="w-4 h-4 align-middle text-green-500 hover:text-green-300 " />
        </Link>

      </div>

      <div className="flex items-center justify-center ">
        <div className="p-6 rounded-lg shadow-md text-gray-400">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger> Funding </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className=" flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <Image
                            src="/logo/logo.png"
                            width={128}
                            height={64}
                            alt="Logo"
                            className="w-24 h-auto"
                          />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Ardhi Analytics Platform
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            A WebGIS platform under the  Prototyping Fund project.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="https://prototypefund.de/en/" title="Prototype Fund" target="_blank" rel="noopener noreferrer">
                      A project of the Open Knowledge Foundation Germany , funded by BMBF .
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Documentation
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div>
        </div>
      </div>
      {/* HR line for the logos */}
      <div className="flex justify-center items-center w-full mt-16">
        <div className="w-full sm:w-1/3 flex items-center relative">
          {/* Left line with gradient fading out to the left */}
          <div className="flex-grow relative before:content-[''] before:absolute before:left-0 before:right-0 before:top-1/2 before:h-[2px] before:bg-gradient-to-r from-purple-400 via-green-400 to-transparent"></div>
          {/* Text in the middle */}
          <span className="shrink px-3 pb-1 z-10 text-xs text-gray-700/[.25] caption roboto-mono-regular">Supported By</span>
          {/* Right line with gradient fading out to the right */}
          <div className="flex-grow relative before:content-[''] before:absolute before:left-0 before:right-0 before:top-1/2 before:h-[2px] before:bg-gradient-to-r from-transparent via-green-400 to-purple-400"></div>
        </div>
      </div>
      <div className="flex mt-8 space-x-4 items-center justify-center">
        {/* BMBF Logo */}
        <div className="flex-none w-1/3 flex items-center justify-center">
          <Link
            href="https://www.bmbf.de/DE/Home/home_node.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/bmbf_logo.svg"
              alt="BMBF Logo"
              width={128}
              height={64}
              className="w-32 h-auto rounded"
            />
          </Link>
        </div>

        {/* Prototype Fund Logo */}
        <div className="flex-auto w-1/3 flex items-center justify-center">
          <Link
            href="https://prototypefund.de/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/prototypefund.jpg"
              alt="Prototype Fund Logo"
              width={128}
              height={64}
              className="w-32 h-auto rounded"
            />
          </Link>
        </div>

        {/* Open Knowledge Foundation Logo */}
        <div className="flex-auto w-1/3 flex items-center justify-center">
          <Link
            href="https://okfn.de/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/logo-okfn.svg"
              alt="Open Knowledge Foundation Germany"
              width={128}
              height={64}
              className="w-32 h-auto bg-white rounded"
            />
          </Link>
        </div>
      </div>

    </div>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          href={href || "#"}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
