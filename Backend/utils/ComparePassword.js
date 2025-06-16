export default comparePassword = async function (password) {
	const result = await bcrypt.compare(password, this.password);
    console.log(`Compare password result: ${result}`);
    return result;
};