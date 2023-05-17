describe('Api-demo app tests', () => {
    it('verify app option is accessible', async () => {
        // find element by accessibility id
        const appOption = await $("~App")

        // click on element
        await appOption.click()

        //assert whether app option is opened
        const actionBar = await $("~Action Bar")
        expect(actionBar).toBeExisting()
    })

    it('verify the header API Demo', async () => {
        // find element od header by class name
        const headerElement = await $("android.widget.TextView")

        // assert header text
        expect(headerElement).toHaveText("API Demos")
    })
})
