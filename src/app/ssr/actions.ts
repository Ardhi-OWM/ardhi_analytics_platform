'use server'

import { createClerkSupabaseClientSsr } from './client'

const client = await createClerkSupabaseClientSsr()

export async function addTask(name: string) {
    try {
        const response = await client.from('tasks').insert({
            name,
        })

        console.log('Task successfully added!', response)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error adding task:', error.message)
        } else {
            console.error('Error adding task:', error)
        }
        throw new Error('Failed to add task')
    }
}