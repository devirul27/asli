<?php
public function actionDelete()
{
    $id = (new RequestInjector)->build()->query('id');
    $user = (new UserInjector)->build()->getID();

    /** @var Domain $domain */
    $domain = Domain::findByAttributes([
        'id' => $id,
        'user' => $user
    ]);

    if (!$domain) return false;
    return $domain->delete();
}