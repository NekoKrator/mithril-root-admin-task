import * as nodemailer from 'nodemailer'

export const getTestAccount = async () => {
    const testAccount = await nodemailer.createTestAccount()

    return testAccount
}

export function test() {
    console.log(getTestAccount())
}
