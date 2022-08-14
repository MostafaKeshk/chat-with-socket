const Form = ({username,onChange,connect}) => {
    return ( 
        <form>
            <input type="text"
            value={username}
            onChange={onChange}
            />
            <button onClick={connect}>connect</button>
        </form>
     );
}
 
export default Form;