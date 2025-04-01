import './SearchForm.css';

function SearchForm (props) {
    const {handleGender, handleCountry, country} = props;
    return (
        <div className="SearchForm">
            <div className="SearchForm-field">
                <select onChange={handleGender}>
                        <option value="">Both</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                </select>
            </div>
        <div className="SearchForm-field">
            <input type="text" placeholder="Select country code: us, it,..."
            onChange={handleCountry} value={country} />
        </div>
        </div>
    );
}

export default SearchForm;