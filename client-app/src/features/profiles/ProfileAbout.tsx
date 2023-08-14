import { observer } from "mobx-react-lite";
import { Button, Grid, Header, Tab } from "semantic-ui-react";

export default observer(function ProfileAbout()
{

    return(
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header content="About Me" floated="left"/>
                    <Button float="right" basic  content="Edit About"/>
                </Grid.Column> 
            </Grid>
        </Tab.Pane>
    )

})