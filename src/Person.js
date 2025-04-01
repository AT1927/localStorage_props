import './Person.css';

function Person ({person}) {
    return (
        <div className="Person">
            <div className="Person-image">
                <img alt={person.name} src={person.picture.medium}/>
            </div>
            <div className="Person-name">
                {person.name.title} {person.name.first}
            </div>
            <div className="Person-location">
                {person.location.city} <br /> {person.location.state}
            </div>
        </div>          
    );
}

export default Person;