import { Outlet } from "@remix-run/react";
import styled from "styled-components";

const Wrap = styled.div`
  
`;

export default function ReservationsAdmin() {
  return <Wrap>
    <Outlet />
  </Wrap>
}