import { CandidateIcon as Icon } from "../../../components/ui/Icon";

export default function CompaniesSection({
    companiesList,
    setActive,
    setCategoryFilter,
    setSearch,
}) {
    return (
        <section className="companies-grid">

                            {companiesList.map((c) => (
                                <div className="company-card" key={c.name}>

                                    <div className="company-card-top">

                                        <div
                                            className="company-card-logo"
                                            style={{
                                                background: `linear-gradient(135deg, ${c.color}, ${c.color}99)`,
                                            }}
                                        >
                                            {c.logo}
                                        </div>

                                        <div className="company-card-info">
                                            <h3>{c.name}</h3>

                                            <p>
                                                {c.openRoles} open role
                                                {c.openRoles > 1 ? "s" : ""}
                                            </p>
                                        </div>

                                    </div>

                                    <p className="company-card-description">
                                        {c.about}
                                    </p>

                                    <div className="company-card-bottom">

                                        <span className="company-open-jobs">
                                            {c.openRoles} open role
                                            {c.openRoles > 1 ? "s" : ""}
                                        </span>

                                        <button
                                            className="company-view-btn"
                                            onClick={() => {
                                                setSearch(c.name);
                                                setCategoryFilter("All");
                                                setActive("find");
                                            }}
                                        >
                                            View Jobs
                                            <Icon name="arrow" size={16} />
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </section>
    );
}
